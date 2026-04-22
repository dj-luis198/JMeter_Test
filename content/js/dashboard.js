/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.61051606621227, "KoPercent": 0.3894839337877313};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7830665543386689, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48ce3d99-30e7-4dc5-80e2-818beb2927c0"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5db01c85-6603-4a27-9e68-818f7f46f84a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58d6f526-6ec1-4103-8f06-4702f14b5a96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5db01c85-6603-4a27-9e68-818f7f46f84a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7091fb27-f688-419c-acb1-e0dbc75b92f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3372093023255814, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2d1e699-7e30-42f4-94f2-4c31320ab1d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9895833333333334, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7091fb27-f688-419c-acb1-e0dbc75b92f6"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7910447761194029, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2d1e699-7e30-42f4-94f2-4c31320ab1d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf35a184-968c-4387-b03d-cfc423696f74"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1ef4ae5-8d7c-481d-8777-611610283c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/c1ef4ae5-8d7c-481d-8777-611610283c66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25ef5aff-4b37-4a66-9bd2-8ddba3df648d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf35a184-968c-4387-b03d-cfc423696f74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/623ea271-d87a-4c00-b40f-654b9146cd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd1816c4-84f5-4a8a-a621-1118e91d44f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bebb4bd-4a85-4fdc-b776-698519d45e47"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48ce3d99-30e7-4dc5-80e2-818beb2927c0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=623ea271-d87a-4c00-b40f-654b9146cd9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25ef5aff-4b37-4a66-9bd2-8ddba3df648d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75c46464-b30d-441e-a4dc-f0dd6447efc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de03fa74-4cf6-4824-93f8-e3c11b9ef8b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de03fa74-4cf6-4824-93f8-e3c11b9ef8b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1027, 4, 0.3894839337877313, 1325.0486854917237, 77, 52286, 166.0, 1022.0000000000002, 2002.599999999994, 34006.28000000002, 4.028762303024122, 584.5786975822032, 2.9481639489520117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/48ce3d99-30e7-4dc5-80e2-818beb2927c0", 3, 0, 0.0, 438.66666666666663, 193, 910, 213.0, 910.0, 910.0, 910.0, 0.018913364183131803, 0.01896877442976207, 0.01212868731795887], "isController": false}, {"data": ["see books", 48, 0, 0.0, 9599.875000000002, 981, 43066, 1580.5, 34300.4, 37931.049999999996, 43066.0, 0.2194275683311162, 264.0457215052731, 1.0789236392062207], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 2258.6, 84, 21788, 88.0, 19618.800000000007, 21788.0, 21788.0, 0.05052954968065325, 0.03922948437121029, 0.01796167586304471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5db01c85-6603-4a27-9e68-818f7f46f84a", 3, 0, 0.0, 259.0, 167, 359, 251.0, 359.0, 359.0, 359.0, 0.019844419749166536, 0.016543476229692544, 0.012725750945917342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 329.2142857142857, 163, 1012, 166.5, 1007.0, 1012.0, 1012.0, 0.09465919309799256, 16.30364619605271, 0.2094308235687868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 10, 0, 0.0, 213.8, 164, 327, 168.0, 326.5, 327.0, 327.0, 0.06284367635506677, 0.0973954241948154, 0.14133690102120974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58d6f526-6ec1-4103-8f06-4702f14b5a96", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 166.0, 82, 256, 163.0, 256.0, 256.0, 256.0, 0.029648736593211922, 0.02203387553460378, 0.014882275985264577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 121.5, 80, 242, 82.0, 242.0, 242.0, 242.0, 0.02964851683294543, 0.007933294543190477, 0.016908919756289192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 172.5, 81, 287, 161.0, 287.0, 287.0, 287.0, 0.029648736593211922, 0.00799126103488915, 0.017430214286243726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 134.75, 82, 291, 83.0, 291.0, 291.0, 291.0, 0.02964851683294543, 0.007991201802629824, 0.017459038720962987], "isController": false}, {"data": ["https://demoqa.com/books", 48, 0, 0.0, 968.6250000000001, 635, 1452, 955.0, 1351.3, 1382.75, 1452.0, 0.2115422754015998, 253.07810537449592, 0.4177133602168308], "isController": false}, {"data": ["deleteBook", 9, 0, 0.0, 563.1111111111111, 389, 859, 577.0, 859.0, 859.0, 859.0, 0.05713777822923677, 0.01032274313711797, 0.038835833640184364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 0, 0.0, 563.1111111111111, 389, 859, 577.0, 859.0, 859.0, 859.0, 0.0570617027212092, 0.01030899902678096, 0.03878412606832188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 3, 16.666666666666668, 10085.999999999998, 409, 34244, 1605.5, 32351.300000000003, 34244.0, 34244.0, 0.07364312541424257, 0.023444979379924884, 0.033225706974003975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 141.25, 81, 245, 84.5, 245.0, 245.0, 245.0, 0.049153031820443976, 0.01324827810785404, 0.028944607605202847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 131.93749999999997, 78, 253, 82.5, 247.4, 253.0, 253.0, 0.10455329604265774, 0.027976174917664277, 0.05962805164932824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 162.0, 80, 243, 164.5, 243.0, 243.0, 243.0, 0.049153635833000524, 0.013248440908113423, 0.028896961690885074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 83.93750000000001, 79, 104, 83.0, 95.60000000000001, 104.0, 104.0, 0.10455397925910435, 0.07770075997673674, 0.05248119662029262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 129.3125, 81, 249, 82.0, 245.5, 249.0, 249.0, 0.10443932401647531, 0.028149661551315607, 0.06150089099798301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 135.3125, 78, 243, 83.0, 243.0, 243.0, 243.0, 0.10455261283514014, 0.028180196428221366, 0.06146550090503356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 100.0, 80, 243, 83.0, 228.40000000000006, 243.0, 243.0, 0.049464790961793396, 0.013332306938920877, 0.029079886874023072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 97.59999999999998, 80, 240, 82.0, 224.50000000000006, 240.0, 240.0, 0.04946528031974357, 0.013332438836180883, 0.029128480500786497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 101.4, 82, 245, 84.0, 230.30000000000004, 245.0, 245.0, 0.04946430161352552, 0.03676009133583293, 0.024828760770851676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 119.875, 77, 239, 81.5, 239.0, 239.0, 239.0, 0.04915605203168107, 0.013153084235039662, 0.02803431092431811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5db01c85-6603-4a27-9e68-818f7f46f84a", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 98.2, 79, 242, 83.0, 226.40000000000006, 242.0, 242.0, 0.04942591796286137, 0.013225294454906264, 0.028188218838194373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.25, 82, 245, 84.5, 245.0, 245.0, 245.0, 0.04920139977982374, 0.03656471214106041, 0.024696796373856834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 391.625, 83, 2362, 87.0, 2362.0, 2362.0, 2362.0, 0.04753868460459699, 0.03741814432744646, 0.016898516793040337], "isController": false}, {"data": ["deleteAccount", 8, 0, 0.0, 493.12500000000006, 359, 910, 435.5, 910.0, 910.0, 910.0, 0.05659870105981068, 0.010225351265688453, 0.03852470179559379], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 15, 0, 0.0, 3799.6666666666665, 891, 23696, 1381.0, 18053.600000000002, 23696.0, 23696.0, 0.08015261057052628, 0.041485237892948175, 0.036867069901091676], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 237.7, 162, 435, 185.5, 432.7, 435.0, 435.0, 0.06267156340482069, 0.1405948393101114, 0.04051618649803838], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 287.0, 168, 485, 249.0, 485.0, 485.0, 485.0, 0.04912707331601604, 0.07613736850831783, 0.11048793930350093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7091fb27-f688-419c-acb1-e0dbc75b92f6", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.64285714285714, 79, 84, 81.5, 84.0, 84.0, 84.0, 0.0952523506919403, 0.07078812390289703, 0.047812215093415336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 104.07142857142857, 78, 245, 82.0, 242.0, 245.0, 245.0, 0.09514553869365175, 0.04587374187015352, 0.05312115595033403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 480.0, 474, 486, 480.0, 486.0, 486.0, 486.0, 0.46146746654360865, 135.68675732579604, 0.26318066451315186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 759.0, 717, 801, 759.0, 801.0, 801.0, 801.0, 0.43696744592527853, 393.1840759504042, 0.24878127048284904], "isController": false}, {"data": ["addBook", 43, 1, 2.3255813953488373, 10655.418604651164, 507, 54693, 1191.0, 52519.6, 53666.6, 54693.0, 0.23308001691185237, 78.68405961360212, 0.8474241439729845], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 89.0, 85, 93, 89.0, 93.0, 93.0, 93.0, 0.5059448520111307, 0.8952852264103213, 0.280147198330382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2d1e699-7e30-42f4-94f2-4c31320ab1d8", 3, 0, 0.0, 257.3333333333333, 163, 417, 192.0, 417.0, 417.0, 417.0, 0.021942335542195112, 0.0182924223058469, 0.014071094081420692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 104.375, 82, 239, 83.5, 239.0, 239.0, 239.0, 0.042233519688738966, 0.03138643406555698, 0.02119924718751155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 100.5, 79, 232, 82.5, 232.0, 232.0, 232.0, 0.042236641342280466, 0.01130160129666489, 0.024088084515519328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 101.375, 80, 243, 81.0, 243.0, 243.0, 243.0, 0.04220010233524816, 0.011374246332547355, 0.024809044536933], "isController": false}, {"data": ["https://demoqa.com/books-0", 48, 0, 0.0, 177.87499999999997, 81, 610, 84.0, 330.0, 333.1, 610.0, 0.21236119099234615, 0.15781920541521036, 0.1026550679113392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 101.625, 81, 238, 83.0, 238.0, 238.0, 238.0, 0.04223641835172377, 0.011384034633863048, 0.024871640884852966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7091fb27-f688-419c-acb1-e0dbc75b92f6", 3, 0, 0.0, 269.6666666666667, 178, 366, 265.0, 366.0, 366.0, 366.0, 0.06739755571531272, 0.030495638816498923, 0.04322043774712437], "isController": false}, {"data": ["https://demoqa.com/books-3", 48, 0, 0.0, 522.0625, 385, 732, 483.5, 649.5, 723.4, 732.0, 0.21260386584696064, 62.51259567173963, 0.10692479581170385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 82.5, 82, 83, 82.5, 83.0, 83.0, 83.0, 0.5070993914807302, 0.3768580438640974, 0.28474819345841784], "isController": false}, {"data": ["https://demoqa.com/books-1", 48, 0, 0.0, 139.70833333333337, 79, 337, 84.5, 246.1, 248.64999999999998, 337.0, 0.21289240949854965, 0.37671977149548047, 0.10353556633816184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 466.42857142857144, 80, 1093, 87.0, 996.6, 1084.8999999999999, 1093.0, 0.11064394777605666, 47.4240109056734, 0.06051869948576908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 201.71428571428572, 77, 928, 82.0, 924.0, 928.0, 928.0, 0.09471106360524428, 12.196335294923486, 0.05451699894464814], "isController": false}, {"data": ["https://demoqa.com/books-2", 48, 0, 0.0, 788.875, 552, 1122, 769.0, 1028.7, 1054.1, 1122.0, 0.21214438193060225, 190.8878877712023, 0.10648653546125934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 342.8095238095239, 80, 816, 84.0, 730.8, 807.7999999999998, 816.0, 0.11064219893467368, 15.507278017502543, 0.06062579194788226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 189.49999999999997, 78, 729, 82.0, 606.0, 729.0, 729.0, 0.09499189176352447, 4.012055700870532, 0.05477141303831566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 10, 0, 0.0, 1593.8999999999996, 83, 15144, 87.0, 13639.400000000005, 15144.0, 15144.0, 0.06292988980976295, 0.04701305244577016, 0.022369609268314168], "isController": false}, {"data": ["deleteBooks", 9, 0, 0.0, 595.4444444444445, 165, 1425, 458.0, 1425.0, 1425.0, 1425.0, 0.05702012810522115, 0.01030148798775968, 0.039312705510045044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 134, 1, 0.746268656716418, 4858.425373134328, 79, 52286, 169.5, 21428.0, 38849.0, 52024.9, 0.5499173072108933, 1.2360635462279366, 0.2611441934990746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 3815.5, 85, 15006, 85.5, 15006.0, 15006.0, 15006.0, 0.0326346792418964, 0.025272754530101412, 0.01160060863676786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 227.375, 164, 478, 167.5, 478.0, 478.0, 478.0, 0.04217941012094946, 0.06536984752143242, 0.09486248194194004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 1429.3750000000002, 83, 14051, 85.5, 9546.500000000004, 14051.0, 14051.0, 0.10453553554861555, 0.08483303714931595, 0.037159116152046937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2d1e699-7e30-42f4-94f2-4c31320ab1d8", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf35a184-968c-4387-b03d-cfc423696f74", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1ef4ae5-8d7c-481d-8777-611610283c66", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 91.1904761904762, 81, 243, 83.0, 88.6, 227.5999999999998, 243.0, 0.1106427818756586, 0.08222573926501581, 0.055537490121180186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 15, 0, 0.0, 2917.2, 187, 34425, 648.0, 14856.000000000011, 34425.0, 34425.0, 0.0799991466757688, 0.04914010083892438, 0.036171489170782174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 121.33333333333334, 79, 252, 83.0, 250.2, 251.9, 252.0, 0.11064336482278622, 0.10873962389159057, 0.05867638264690541], "isController": false}, {"data": ["login", 15, 0, 0.0, 7142.133333333332, 1599, 49860, 2501.0, 34514.40000000001, 49860.0, 49860.0, 0.08006661542403279, 12.884449028258178, 0.13850586187708175], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c1ef4ae5-8d7c-481d-8777-611610283c66", 2, 0, 0.0, 789.0, 435, 1143, 789.0, 1143.0, 1143.0, 1143.0, 0.026700487283892932, 0.03775615779987985, 0.016596543121286965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25ef5aff-4b37-4a66-9bd2-8ddba3df648d", 3, 0, 0.0, 366.3333333333333, 233, 454, 412.0, 454.0, 454.0, 454.0, 0.01778547164106547, 0.017837577515013903, 0.011405396853157218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 341.5, 165, 535, 333.0, 535.0, 535.0, 535.0, 0.029630288080475863, 0.045921159359096866, 0.0666392123528671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 4377.571428571428, 81, 21753, 85.0, 18100.0, 21753.0, 21753.0, 0.09850137198339548, 0.07974378649827622, 0.03501415957222261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf35a184-968c-4387-b03d-cfc423696f74", 3, 0, 0.0, 274.6666666666667, 162, 408, 254.0, 408.0, 408.0, 408.0, 0.016405903937963807, 0.016453968109657064, 0.01052071313730101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 218.79999999999998, 165, 489, 168.5, 473.00000000000006, 489.0, 489.0, 0.04940516185131023, 0.07656835142385678, 0.11111336693707759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/623ea271-d87a-4c00-b40f-654b9146cd9e", 3, 0, 0.0, 547.0, 217, 869, 555.0, 869.0, 869.0, 869.0, 0.016957583431310482, 0.020043289530953242, 0.010874491979063037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd1816c4-84f5-4a8a-a621-1118e91d44f0", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.6438224546370968, 1.2029832409274193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 109.75, 86, 269, 86.5, 269.0, 269.0, 269.0, 0.043411492107248095, 0.035992535936575816, 0.015431428834998345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bebb4bd-4a85-4fdc-b776-698519d45e47", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 560.0952380952383, 165, 1177, 172.0, 1088.0, 1168.8, 1177.0, 0.1105932538115175, 63.093579872356955, 0.23525238137556945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 2349.6190476190473, 82, 27091, 87.0, 14965.600000000011, 26199.79999999999, 27091.0, 0.11056879748534963, 0.08584198632895797, 0.03930375223112038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48ce3d99-30e7-4dc5-80e2-818beb2927c0", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=623ea271-d87a-4c00-b40f-654b9146cd9e", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25ef5aff-4b37-4a66-9bd2-8ddba3df648d", 1, 0, 0.0, 1425.0, 1425, 1425, 1425.0, 1425.0, 1425.0, 1425.0, 0.7017543859649122, 0.12678179824561403, 0.4838267543859649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c46464-b30d-441e-a4dc-f0dd6447efc0", 2, 0, 0.0, 234.5, 194, 275, 234.5, 275.0, 275.0, 275.0, 0.01064356303916299, 0.02104806167412603, 0.006615847533620355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 248.74999999999997, 163, 335, 255.0, 333.6, 335.0, 335.0, 0.1043834526131745, 0.16177396415733195, 0.23476083141420007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 842.0, 799, 885, 842.0, 885.0, 885.0, 885.0, 0.42909246942716156, 513.3437701137095, 0.9675532342844884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de03fa74-4cf6-4824-93f8-e3c11b9ef8b2", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de03fa74-4cf6-4824-93f8-e3c11b9ef8b2", 3, 0, 0.0, 271.3333333333333, 163, 476, 175.0, 476.0, 476.0, 476.0, 0.08020961445911984, 0.036292761750708516, 0.051436504063953795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 10, 0, 0.0, 82.80000000000001, 81, 84, 83.0, 84.0, 84.0, 84.0, 0.06287726358148894, 0.04672812264210262, 0.031561438946177064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 10, 0, 0.0, 112.6, 78, 244, 81.0, 243.2, 244.0, 244.0, 0.06287647288137724, 0.01682436872021227, 0.03585923844016046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 10, 0, 0.0, 112.70000000000002, 80, 243, 81.5, 242.2, 243.0, 243.0, 0.06287726358148894, 0.01694738744969819, 0.03696495378521127], "isController": false}, {"data": ["register", 18, 3, 16.666666666666668, 10085.999999999998, 409, 34244, 1605.5, 32351.300000000003, 34244.0, 34244.0, 0.07259264636492324, 0.02311054952633298, 0.03275176037167435], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 10, 0, 0.0, 114.10000000000001, 81, 241, 83.5, 240.7, 241.0, 241.0, 0.06287647288137724, 0.016947174331308712, 0.03702589174557664], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 75.0, 0.2921129503407984], "isController": false}, {"data": ["401/Unauthorized", 1, 25.0, 0.09737098344693282], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1027, 4, "406/Not Acceptable", 3, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 134, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
