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

    var data = {"OkPercent": 99.00687547746371, "KoPercent": 0.9931245225362872};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7773026315789474, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bb82dca-57f2-49ab-aecf-7d94e9798d75"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/979095de-ded5-4172-baef-da6d02302f16"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d062abed-7021-43da-ae01-4fe0a534424b"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ff797f1-9fed-4087-b7c1-81ffa13cb3b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1437a17a-f071-4c4f-9e68-8799c2649568"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4b0c6ed-ae56-4d08-91cc-0b309c7bc0f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=221da25d-4e2f-49c5-b757-ff6cad28c6a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce4a948f-697c-43af-95db-5946aebd17bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=671fd848-bcac-4c59-99d5-fe8db7b192a7"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=521ed8f0-ff50-4e75-b207-fde01ccea118"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cec996ce-6b2d-41c1-bc16-65a02b3d056f"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb8173f3-ccee-492e-8ccf-76edb7b4523e"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bddb2e0-9be1-4efe-a294-732f3b8b2d1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce4a948f-697c-43af-95db-5946aebd17bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b671bd57-3b8e-4c4f-91d9-ae2717216eb4"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.34375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d062abed-7021-43da-ae01-4fe0a534424b"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bb82dca-57f2-49ab-aecf-7d94e9798d75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9587912087912088, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/221da25d-4e2f-49c5-b757-ff6cad28c6a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/521ed8f0-ff50-4e75-b207-fde01ccea118"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ff797f1-9fed-4087-b7c1-81ffa13cb3b0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d25db3f-1431-4c76-a9cc-46ddc660cdb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4b0c6ed-ae56-4d08-91cc-0b309c7bc0f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1437a17a-f071-4c4f-9e68-8799c2649568"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bddb2e0-9be1-4efe-a294-732f3b8b2d1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f428cac-488d-48e6-9e64-80aeb0bde502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec996ce-6b2d-41c1-bc16-65a02b3d056f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb8173f3-ccee-492e-8ccf-76edb7b4523e"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/671fd848-bcac-4c59-99d5-fe8db7b192a7"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 13, 0.9931245225362872, 418.4614209320089, 136, 2675, 157.0, 1101.0, 1309.5, 1816.2000000000025, 5.089503724785766, 682.4000926093329, 3.721596321482449], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2108.6111111111113, 1686, 2630, 2060.5, 2478.5, 2531.0, 2630.0, 0.2459184370517112, 295.92384942761345, 1.2091790337454744], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 551.3076923076923, 146, 1365, 501.0, 1083.7999999999997, 1365.0, 1365.0, 0.06579280327951818, 0.01246465218381497, 0.04447636994534136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 551.3076923076923, 146, 1365, 501.0, 1083.7999999999997, 1365.0, 1365.0, 0.06733797447372783, 0.012757389695217967, 0.04552091588710011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 160.3684210526316, 136, 445, 145.0, 152.0, 445.0, 445.0, 0.0997972539997689, 0.026703562105406912, 0.056915621421743195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 144.73684210526315, 138, 154, 144.0, 152.0, 154.0, 154.0, 0.09995423148347861, 0.07428239273332737, 0.05017233885010548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 197.8421052631579, 138, 594, 145.0, 428.0, 594.0, 594.0, 0.09995528316279559, 0.026941072414972247, 0.05886038647184154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 190.47368421052633, 138, 446, 144.0, 425.0, 446.0, 446.0, 0.09980773877688243, 0.02690130459220659, 0.05867603392937814], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 288.2857142857143, 143, 575, 230.5, 523.5, 575.0, 575.0, 0.06933645017185534, 0.16344075478916767, 0.044815258600196126], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 164.33333333333331, 138, 428, 144.0, 261.80000000000007, 428.0, 428.0, 0.0694598799733274, 0.05162008658174039, 0.034865603814736607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 201.13333333333333, 139, 442, 143.0, 434.8, 442.0, 442.0, 0.06946180989691868, 0.025541686347512804, 0.039226024677465665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1019.25, 987, 1036, 1027.0, 1036.0, 1036.0, 1036.0, 0.05219002387693592, 15.3455998917057, 0.02976462299231502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1273.0, 1220, 1323, 1274.5, 1323.0, 1323.0, 1323.0, 0.051998700032499186, 46.78852169320767, 0.029604728631784205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 143.5, 138, 149, 143.5, 149.0, 149.0, 149.0, 0.052774625959838506, 0.09338634984299549, 0.02922188761643402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 145.35000000000002, 140, 156, 144.0, 149.9, 155.7, 156.0, 0.09957233681338651, 0.07399858233885462, 0.049980645627031896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 204.2, 139, 446, 147.0, 441.0, 445.75, 446.0, 0.09943174756267928, 0.03407285177709391, 0.05628963287313006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 239.15, 138, 1325, 144.5, 560.2000000000003, 1287.4999999999995, 1325.0, 0.09958175662218681, 4.505690358307608, 0.05811529077872934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 223.00000000000003, 139, 711, 144.5, 576.4000000000003, 705.0999999999999, 711.0, 0.09957977335643585, 1.4894858540708211, 0.058211379229650875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 217.0, 138, 427, 151.5, 427.0, 427.0, 427.0, 0.05277184094567139, 0.03921813570278899, 0.02963262553101665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 856.7333333333332, 142, 1428, 994.0, 1369.8, 1428.0, 1428.0, 0.07139287499107588, 42.83270381178458, 0.037880985102686754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 255.6666666666667, 137, 1274, 144.0, 765.8000000000003, 1274.0, 1274.0, 0.06946213156127717, 4.184283939486907, 0.04043817580865498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 698.0000000000001, 142, 1142, 995.0, 1117.4, 1142.0, 1142.0, 0.07148916700822602, 14.019882030959575, 0.0380018911863389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 220.9333333333333, 142, 988, 144.0, 659.2000000000002, 988.0, 988.0, 0.06946245322861483, 1.3790919897056646, 0.040506197497962436], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 472.9166666666667, 393, 669, 453.0, 630.9000000000001, 669.0, 669.0, 0.06555585905490303, 0.011843587817536192, 0.04519769188746244], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bb82dca-57f2-49ab-aecf-7d94e9798d75", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 432.8, 289, 1469, 296.5, 723.5000000000003, 1432.4999999999995, 1469.0, 0.09935419771485346, 6.089388700012419, 0.22217888412816691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/979095de-ded5-4172-baef-da6d02302f16", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d062abed-7021-43da-ae01-4fe0a534424b", 3, 0, 0.0, 539.0, 234, 911, 472.0, 911.0, 911.0, 911.0, 0.019129115150896835, 0.026358575662026793, 0.012267043244552984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 553.1, 157, 1307, 557.5, 919.0, 1287.6499999999996, 1307.0, 0.08457553652605984, 0.05195118405751137, 0.03824069669098214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.13333333333335, 143, 152, 145.0, 150.8, 152.0, 152.0, 0.0714878041806068, 0.05312716697406423, 0.035883526707843644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 277.93333333333334, 140, 444, 148.0, 443.4, 444.0, 444.0, 0.0713918556171112, 0.09058771262874331, 0.03671846740723818], "isController": false}, {"data": ["login", 20, 0, 0.0, 2291.3, 1460, 4697, 2137.5, 3196.9, 4622.0999999999985, 4697.0, 0.0838778403133676, 20.185775655085934, 0.15437126743610605], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1ff797f1-9fed-4087-b7c1-81ffa13cb3b0", 3, 0, 0.0, 362.33333333333337, 224, 633, 230.0, 633.0, 633.0, 633.0, 0.030628496753379343, 0.025075087674071957, 0.019641321160207458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 167.93333333333334, 140, 434, 150.0, 271.4000000000001, 434.0, 434.0, 0.07115276974015008, 0.05760317003377385, 0.025292586118568976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1437a17a-f071-4c4f-9e68-8799c2649568", 3, 0, 0.0, 350.0, 262, 456, 332.0, 456.0, 456.0, 456.0, 0.041889495510842395, 0.034921548829188596, 0.026862729868606616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4b0c6ed-ae56-4d08-91cc-0b309c7bc0f8", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=221da25d-4e2f-49c5-b757-ff6cad28c6a0", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce4a948f-697c-43af-95db-5946aebd17bc", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=671fd848-bcac-4c59-99d5-fe8db7b192a7", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1010.3999999999999, 289, 1574, 1182.0, 1515.8, 1574.0, 1574.0, 0.07134228124078495, 56.93696950325559, 0.14828140160234765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=521ed8f0-ff50-4e75-b207-fde01ccea118", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 391.52631578947364, 284, 746, 295.0, 590.0, 746.0, 746.0, 0.09972078181092939, 0.1545477350917431, 0.2242743754986039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1041.6666666666665, 143, 1647, 1414.5, 1647.0, 1647.0, 1647.0, 0.07577766832114576, 60.44438274353048, 0.13021820021722932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec996ce-6b2d-41c1-bc16-65a02b3d056f", 3, 0, 0.0, 299.6666666666667, 229, 420, 250.0, 420.0, 420.0, 420.0, 0.025908973141031178, 0.025984878335780292, 0.016614803739528457], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1081.1363636363635, 153, 2675, 977.5, 1826.0, 2549.8999999999983, 2675.0, 0.08702049728258719, 0.027379318392177648, 0.03926120092241727], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb8173f3-ccee-492e-8ccf-76edb7b4523e", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 480.66666666666663, 283, 1419, 299.0, 1088.4, 1419.0, 1419.0, 0.06941359395824077, 5.636591708661891, 0.15492879177541463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 168.42105263157893, 145, 446, 151.0, 188.0, 446.0, 446.0, 0.11158682335805863, 0.08663234821255529, 0.0396656286155599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 575.9444444444445, 288, 1653, 570.0, 1218.3000000000006, 1653.0, 1653.0, 0.09117709631340608, 12.245551000921902, 0.20246736936348256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bddb2e0-9be1-4efe-a294-732f3b8b2d1f", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 146.33333333333334, 142, 150, 147.0, 150.0, 150.0, 150.0, 0.0909008271975275, 0.06755422802472502, 0.04562795427688392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce4a948f-697c-43af-95db-5946aebd17bc", 3, 0, 0.0, 341.3333333333333, 228, 425, 371.0, 425.0, 425.0, 425.0, 0.021668628881393148, 0.02561158576443311, 0.013895572557403807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 240.66666666666669, 137, 429, 153.5, 429.0, 429.0, 429.0, 0.09089945005832716, 0.024322704410138316, 0.051841092611389694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 192.33333333333331, 140, 413, 148.5, 413.0, 413.0, 413.0, 0.09090358160111509, 0.024501355978425548, 0.05344136340221804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 197.16666666666666, 143, 445, 149.5, 445.0, 445.0, 445.0, 0.0909104683404294, 0.024503212169881362, 0.05353419180593646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b671bd57-3b8e-4c4f-91d9-ae2717216eb4", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.8630701013513513, 1.6126478040540542], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1391.5, 1098, 2042, 1183.0, 1881.5, 1924.25, 2042.0, 0.22979310110045365, 274.912437923947, 0.45375161174327855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1081.1363636363635, 153, 2675, 977.5, 1826.0, 2549.8999999999983, 2675.0, 0.08710801393728224, 0.02740685381691479, 0.039300685975609755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 238.83333333333334, 137, 444, 148.5, 444.0, 444.0, 444.0, 0.03153728495513822, 0.008500283835564596, 0.0185712722929183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 241.16666666666666, 142, 446, 144.0, 446.0, 446.0, 446.0, 0.03153993744579073, 0.008500998764685783, 0.018542033537466817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 237.6842105263158, 137, 1033, 147.0, 442.0, 1033.0, 1033.0, 0.11515221304371541, 5.482780624806817, 0.06717607000648489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 203.1578947368421, 138, 687, 147.0, 428.0, 687.0, 687.0, 0.11515500469711204, 1.8114777152337949, 0.06729015462589776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 144.5, 138, 148, 145.0, 148.0, 148.0, 148.0, 0.031586594649230866, 0.008451881771376228, 0.018014229760889476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 159.94736842105263, 138, 425, 145.0, 155.0, 425.0, 425.0, 0.11515011939249221, 0.08557543052508454, 0.05779996227318456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 191.83333333333331, 145, 411, 149.5, 411.0, 411.0, 411.0, 0.031586095800628565, 0.023473651273709314, 0.015854739493674885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 186.47368421052633, 136, 427, 143.0, 425.0, 427.0, 427.0, 0.1151598904162727, 0.03991767583096952, 0.06516809177031056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 198.16666666666669, 149, 437, 150.5, 437.0, 437.0, 437.0, 0.031709791983764585, 0.024959074549720954, 0.011271840119228818], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 514.9166666666667, 415, 911, 453.0, 827.6000000000004, 911.0, 911.0, 0.06578190011018469, 0.011884425312875162, 0.0447753753679675], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1215.35, 758, 1915, 1101.0, 1878.9000000000005, 1914.55, 1915.0, 0.08541861527882771, 0.044210806736112, 0.03928922636360142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 439.0, 290, 858, 298.5, 858.0, 858.0, 858.0, 0.03151227403073497, 0.04883787000661758, 0.07087184286404555], "isController": false}, {"data": ["addBook", 64, 4, 6.25, 1301.6718749999998, 740, 4086, 1127.5, 2092.5, 2227.5, 4086.0, 0.2934810521295719, 83.35443594174171, 1.0705368023519755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d062abed-7021-43da-ae01-4fe0a534424b", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 274.9444444444445, 142, 598, 150.0, 576.5, 587.25, 598.0, 0.23104174154130513, 0.17170191925091133, 0.11168521685834575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bb82dca-57f2-49ab-aecf-7d94e9798d75", 3, 0, 0.0, 365.6666666666667, 290, 428, 379.0, 428.0, 428.0, 428.0, 0.0343780438893027, 0.028659560677247464, 0.022045815905574973], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 817.7777777777777, 679, 1172, 723.0, 1033.0, 1148.0, 1172.0, 0.23067360965753514, 67.82570032401098, 0.11601260641956111], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 230.70370370370367, 139, 450, 148.0, 438.0, 442.5, 450.0, 0.23151720944590215, 0.40967693702731905, 0.11259333037505788], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1108.0925925925926, 949, 1429, 1023.5, 1322.0, 1360.0, 1429.0, 0.23040294915774923, 207.3169786573268, 0.11565148033894833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 166.77777777777777, 142, 429, 151.0, 195.00000000000037, 429.0, 429.0, 0.09152573398553894, 0.06837615869036845, 0.032534538252672045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, 2.197802197802198, 215.95054945054943, 139, 2315, 152.0, 338.1, 435.54999999999995, 861.6699999999781, 0.727162309020009, 1.425283854249904, 0.3549933913631496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 254.5, 146, 452, 166.0, 452.0, 452.0, 452.0, 0.09849305623953512, 0.07627440781049936, 0.03501120358514725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/221da25d-4e2f-49c5-b757-ff6cad28c6a0", 3, 0, 0.0, 378.3333333333333, 230, 579, 326.0, 579.0, 579.0, 579.0, 0.020681952927875134, 0.02851174174790078, 0.013262840907524094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 165.31578947368422, 141, 447, 150.0, 159.0, 447.0, 447.0, 0.0951422376452797, 0.07721015574533928, 0.03382009228797052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/521ed8f0-ff50-4e75-b207-fde01ccea118", 3, 0, 0.0, 292.0, 222, 423, 231.0, 423.0, 423.0, 423.0, 0.017905744162727402, 0.024684513844124525, 0.01148252473976985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ff797f1-9fed-4087-b7c1-81ffa13cb3b0", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 439.6666666666667, 300, 587, 436.5, 587.0, 587.0, 587.0, 0.09069335066584035, 0.14055697998700062, 0.20397147127288118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 429.2631578947368, 278, 1182, 297.0, 854.0, 1182.0, 1182.0, 0.1150476236610576, 7.412967324204203, 0.25719553819581104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d25db3f-1431-4c76-a9cc-46ddc660cdb4", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4b0c6ed-ae56-4d08-91cc-0b309c7bc0f8", 3, 0, 0.0, 367.3333333333333, 248, 491, 363.0, 491.0, 491.0, 491.0, 0.016928302994052524, 0.023337032285095195, 0.010855715136159984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1437a17a-f071-4c4f-9e68-8799c2649568", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bddb2e0-9be1-4efe-a294-732f3b8b2d1f", 3, 0, 0.0, 337.0, 228, 548, 235.0, 548.0, 548.0, 548.0, 0.01818104686467847, 0.021489381889859216, 0.011659069766737168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 166.09999999999997, 143, 413, 152.0, 182.20000000000005, 401.54999999999984, 413.0, 0.10186982055631108, 0.08446042739483214, 0.036211537775876206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 171.46666666666667, 140, 446, 152.0, 282.80000000000007, 446.0, 446.0, 0.07341209635582355, 0.05699474277624972, 0.02609570612648415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f428cac-488d-48e6-9e64-80aeb0bde502", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec996ce-6b2d-41c1-bc16-65a02b3d056f", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 175.22222222222223, 139, 413, 144.5, 411.2, 413.0, 413.0, 0.0912441134874007, 0.06780934605850776, 0.045800267902855435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 206.3333333333333, 138, 445, 144.0, 428.8, 445.0, 445.0, 0.0912445760168701, 0.03964228324344053, 0.051186464627519364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 363.1666666666667, 139, 1239, 279.5, 1014.0000000000003, 1239.0, 1239.0, 0.0912441134874007, 9.144262091745956, 0.05277030434980966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8173f3-ccee-492e-8ccf-76edb7b4523e", 3, 0, 0.0, 450.0, 325, 575, 450.0, 575.0, 575.0, 575.0, 0.07053346813062798, 0.03191455752004326, 0.045231423247831096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 353.9444444444445, 138, 1035, 279.0, 1025.1, 1035.0, 1035.0, 0.0912445760168701, 3.0028534523399166, 0.05285967788130095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/671fd848-bcac-4c59-99d5-fe8db7b192a7", 3, 0, 0.0, 367.0, 319, 415, 367.0, 415.0, 415.0, 415.0, 0.02828560922488002, 0.028368477220656035, 0.01813888351986121], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.45836516424751717], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 15.384615384615385, 0.15278838808250572], "isController": false}, {"data": ["401/Unauthorized", 5, 38.46153846153846, 0.3819709702062643], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 13, "406/Not Acceptable", 6, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
