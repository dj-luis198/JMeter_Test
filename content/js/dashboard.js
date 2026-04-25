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

    var data = {"OkPercent": 97.29299363057325, "KoPercent": 2.7070063694267517};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7197690217391305, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d49004c0-ef00-44a7-a545-740285e7a714"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db4d6434-ae7f-44bc-b17c-befdaff59873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/699c0f6b-9ba4-4458-97c0-5a82757a3a77"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81e6c914-c3e9-402f-bdd1-36ba2e308f4b"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6241fecd-9832-4f70-a34f-ef83c82b83d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ee03933-3fe1-4546-a779-46ba40e13257"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89bfb957-db19-43a8-afda-ed4dbca8bd63"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73beb24a-be01-4bb6-a882-c15f34d92324"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0cdc8f8b-775e-4c5f-89a7-2555b2e85677"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ef1d023-b5f9-4709-b8aa-a017d6a79d8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9591c4e-5bc0-488d-9d44-b57fc94312d4"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe92c7ea-8adf-4d17-b665-f4db01816933"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/db4d6434-ae7f-44bc-b17c-befdaff59873"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59250376-238a-415a-9b02-ec3686a6298a"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=699c0f6b-9ba4-4458-97c0-5a82757a3a77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81e6c914-c3e9-402f-bdd1-36ba2e308f4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19726c82-436f-43bc-aed1-83d66a25e07a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8926380368098159, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19726c82-436f-43bc-aed1-83d66a25e07a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6241fecd-9832-4f70-a34f-ef83c82b83d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cdc8f8b-775e-4c5f-89a7-2555b2e85677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06636cd7-233c-450c-bd90-b24e82e358d6"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73beb24a-be01-4bb6-a882-c15f34d92324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bfb957-db19-43a8-afda-ed4dbca8bd63"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59250376-238a-415a-9b02-ec3686a6298a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe92c7ea-8adf-4d17-b665-f4db01816933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ef1d023-b5f9-4709-b8aa-a017d6a79d8f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9591c4e-5bc0-488d-9d44-b57fc94312d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1256, 34, 2.7070063694267517, 486.12738853503157, 137, 2933, 160.5, 1329.3, 1637.3499999999988, 2191.170000000001, 5.103429781113246, 712.9885911514308, 3.728645926449256], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2349.3962264150955, 1724, 3187, 2329.0, 2859.6, 2977.9, 3187.0, 0.2542417599286204, 305.9385276104153, 1.2501047473052773], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d49004c0-ef00-44a7-a545-740285e7a714", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 690.8749999999998, 151, 1599, 486.5, 1595.5, 1599.0, 1599.0, 0.07831965186914744, 0.016386704504848477, 0.052295958950712464], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 690.8749999999998, 151, 1599, 486.5, 1595.5, 1599.0, 1599.0, 0.07804801904371665, 0.016329871171988565, 0.052114583028458256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db4d6434-ae7f-44bc-b17c-befdaff59873", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 265.25, 143, 443, 150.0, 442.4, 443.0, 443.0, 0.15009944087958274, 0.04016332695410709, 0.08560358737663702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 173.99999999999997, 143, 429, 151.0, 348.0000000000003, 429.0, 429.0, 0.14956439370333904, 0.11115088242992284, 0.07507431480812134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 197.5, 143, 444, 149.0, 444.0, 444.0, 444.0, 0.1500881768038723, 0.0404534539041687, 0.088382002551499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 193.08333333333334, 143, 430, 147.0, 428.5, 430.0, 430.0, 0.15008629962228281, 0.040452947945068415, 0.08823432848888112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/699c0f6b-9ba4-4458-97c0-5a82757a3a77", 3, 0, 0.0, 441.66666666666663, 239, 712, 374.0, 712.0, 712.0, 712.0, 0.021648301690732362, 0.025587559713232164, 0.013882537217038656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81e6c914-c3e9-402f-bdd1-36ba2e308f4b", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.18378846642929808, 0.701376525940997], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 249.81249999999991, 147, 541, 238.0, 408.0000000000001, 541.0, 541.0, 0.0781345379074594, 0.13383591747039433, 0.050493682090098885], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 166.64705882352942, 143, 447, 149.0, 225.3999999999998, 447.0, 447.0, 0.10108457806107887, 0.07512242568796976, 0.05073971984706498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 197.7058823529412, 138, 445, 146.0, 443.4, 445.0, 445.0, 0.1010923925001338, 0.04491317575804427, 0.05665541022698215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1079.9999999999998, 846, 1196, 1139.0, 1196.0, 1196.0, 1196.0, 0.07077283940631697, 20.809564664890605, 0.04036263497391515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1563.0000000000002, 1322, 1687, 1579.0, 1687.0, 1687.0, 1687.0, 0.07038075991111915, 63.328731484204546, 0.04007029592595944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 229.71428571428575, 145, 444, 148.0, 444.0, 444.0, 444.0, 0.07148546802557136, 0.12649576959212436, 0.0395822855180654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 192.8, 145, 459, 150.0, 456.6, 459.0, 459.0, 0.07354491387890584, 0.054655936974460306, 0.036916099349372664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 165.86666666666667, 143, 425, 148.0, 263.6000000000001, 425.0, 425.0, 0.07354635626835594, 0.027043608086176715, 0.041532623324981734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 313.8, 143, 1753, 149.0, 969.4000000000004, 1753.0, 1753.0, 0.07354527447096432, 4.430245716294201, 0.042815224239541864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 252.73333333333338, 144, 846, 150.0, 609.6000000000001, 846.0, 846.0, 0.07354419270539667, 1.4601299311381208, 0.04288641497801029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 149.71428571428572, 143, 160, 149.0, 160.0, 160.0, 160.0, 0.07148619805761787, 0.053125973361178906, 0.04014117566711941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 877.421052631579, 141, 1797, 1176.0, 1622.0, 1797.0, 1797.0, 0.10141284100067786, 48.04002796525809, 0.05503272899286374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 380.4117647058824, 143, 2057, 149.0, 1933.8, 2057.0, 2057.0, 0.1010863812859377, 10.724946836739548, 0.05840572282708877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 697.8947368421052, 143, 1342, 1109.0, 1320.0, 1342.0, 1342.0, 0.10156245823912079, 15.730195654730405, 0.05521310242573913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 255.1764705882353, 138, 739, 148.0, 711.8, 739.0, 739.0, 0.10108878568582795, 3.5209186889379134, 0.05850583155932425], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 449.87500000000006, 149, 983, 440.0, 804.5000000000002, 983.0, 983.0, 0.07860013165522052, 0.016445388874151364, 0.0527902739705839], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 509.79999999999995, 295, 1902, 301.0, 1307.4000000000003, 1902.0, 1902.0, 0.07349086508546988, 5.967678334770488, 0.1640291228987737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 652.3636363636364, 177, 1635, 613.5, 1388.1999999999996, 1622.1, 1635.0, 0.10032560218162583, 0.0616257849338307, 0.04536206426766871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 162.42105263157896, 139, 442, 145.0, 157.0, 442.0, 442.0, 0.10156462985037927, 0.07547918292591661, 0.05098068334286615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 225.47368421052633, 137, 505, 149.0, 446.0, 505.0, 505.0, 0.10141284100067786, 0.10730287545435621, 0.05335432979455893], "isController": false}, {"data": ["login", 22, 0, 0.0, 2952.1818181818185, 1721, 4070, 2783.5, 3973.9, 4055.8999999999996, 4070.0, 0.10111269929542833, 38.6256211465146, 0.20590581466961425], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6241fecd-9832-4f70-a34f-ef83c82b83d8", 3, 0, 0.0, 395.6666666666667, 347, 489, 351.0, 489.0, 489.0, 489.0, 0.020485506504148314, 0.024213175168151867, 0.013136864522516986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 152.88235294117646, 147, 161, 153.0, 157.0, 161.0, 161.0, 0.09861818519334965, 0.07983835500516295, 0.03505568301794851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ee03933-3fe1-4546-a779-46ba40e13257", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89bfb957-db19-43a8-afda-ed4dbca8bd63", 3, 0, 0.0, 427.66666666666663, 239, 802, 242.0, 802.0, 802.0, 802.0, 0.14561693039510729, 0.06588786889622367, 0.09338064872342491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73beb24a-be01-4bb6-a882-c15f34d92324", 3, 0, 0.0, 850.0, 240, 2062, 248.0, 2062.0, 2062.0, 2062.0, 0.02419023198432473, 0.02859203526532653, 0.015512616213906158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1042.6315789473683, 292, 1943, 1340.0, 1768.0, 1943.0, 1943.0, 0.10133387378066015, 63.879939651344806, 0.2142563510338722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cdc8f8b-775e-4c5f-89a7-2555b2e85677", 3, 0, 0.0, 334.6666666666667, 241, 503, 260.0, 503.0, 503.0, 503.0, 0.07085163667280714, 0.032058520499740215, 0.0454354571111426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ef1d023-b5f9-4709-b8aa-a017d6a79d8f", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9591c4e-5bc0-488d-9d44-b57fc94312d4", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 466.66666666666663, 294, 874, 441.0, 789.7000000000003, 874.0, 874.0, 0.14928343949044584, 0.2313601742884156, 0.3357419542446258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 991.2307692307694, 147, 1837, 1472.0, 1813.0, 1837.0, 1837.0, 0.11740905314114375, 75.64790887702756, 0.1781509513520104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe92c7ea-8adf-4d17-b665-f4db01816933", 3, 0, 0.0, 508.66666666666663, 237, 865, 424.0, 865.0, 865.0, 865.0, 0.018576311487591025, 0.021956571292787438, 0.0119125434995294], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1134.8749999999998, 282, 2580, 1178.5, 1958.0, 2493.5, 2580.0, 0.10046128473239625, 0.03139415147887383, 0.04532530619762409], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 159.73333333333332, 149, 213, 155.0, 186.0, 213.0, 213.0, 0.07658062408103251, 0.059454683734785976, 0.027222018716304523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 608.7058823529413, 294, 2202, 301.0, 2081.2, 2202.0, 2202.0, 0.1009950987672657, 14.352843504010101, 0.2241002803356602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 390.5, 293, 602, 301.5, 594.3, 602.0, 602.0, 0.12079391802622738, 0.18720698037853795, 0.27166835274843915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db4d6434-ae7f-44bc-b17c-befdaff59873", 3, 0, 0.0, 669.6666666666666, 483, 985, 541.0, 985.0, 985.0, 985.0, 0.040700592871969504, 0.026166559544967372, 0.02610031509042315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 148.9, 144, 156, 149.0, 155.6, 156.0, 156.0, 0.06694202151516572, 0.04974890466117295, 0.033601756893354665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 176.39999999999998, 145, 425, 148.0, 398.6000000000001, 425.0, 425.0, 0.06694560669456066, 0.01791317991631799, 0.038179916317991634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 203.29999999999998, 140, 441, 144.5, 439.6, 441.0, 441.0, 0.06694784762669881, 0.01804453705563366, 0.039358011983664724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 147.29999999999998, 142, 152, 148.5, 152.0, 152.0, 152.0, 0.06694515852613539, 0.018043812258997427, 0.03942180721802699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 157.0, 149, 174, 152.5, 174.0, 174.0, 174.0, 0.10608391237468838, 0.0312864663448788, 0.06557726223943139], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1632.7169811320755, 1141, 2581, 1480.0, 2252.8, 2359.3, 2581.0, 0.2504832436162219, 299.66504143016476, 0.49460656112500057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59250376-238a-415a-9b02-ec3686a6298a", 3, 0, 0.0, 372.6666666666667, 269, 575, 274.0, 575.0, 575.0, 575.0, 0.04174668113884946, 0.026839093505607974, 0.026771146433441875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1134.8749999999998, 282, 2580, 1178.5, 1958.0, 2493.5, 2580.0, 0.10029251984956122, 0.03134141245298788, 0.04524916422900125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 144.5, 143, 145, 145.0, 145.0, 145.0, 145.0, 0.05470609152329112, 0.01474500123088706, 0.03221462225443803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 146.25, 143, 150, 146.0, 150.0, 150.0, 150.0, 0.05470609152329112, 0.01474500123088706, 0.03216119833693482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=699c0f6b-9ba4-4458-97c0-5a82757a3a77", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81e6c914-c3e9-402f-bdd1-36ba2e308f4b", 3, 0, 0.0, 341.6666666666667, 227, 468, 330.0, 468.0, 468.0, 468.0, 0.04061518466370627, 0.03385920830851294, 0.026045544852702263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 220.0, 137, 434, 148.0, 429.8, 434.0, 434.0, 0.08034064433196755, 0.021654314292600625, 0.0472315116092231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 262.06666666666666, 144, 444, 149.0, 443.4, 444.0, 444.0, 0.08021990951194208, 0.021621772485640636, 0.047238872495801824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 169.26666666666665, 139, 447, 150.0, 282.0000000000001, 447.0, 447.0, 0.08033978372530222, 0.05970564005366698, 0.040326805502739586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 147.25, 143, 152, 147.0, 152.0, 152.0, 152.0, 0.05470534334441116, 0.014637953199578769, 0.031199141126109494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 204.73333333333335, 138, 444, 148.0, 444.0, 444.0, 444.0, 0.08021862248581467, 0.02146474859483713, 0.04574968313644118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 146.25, 144, 150, 145.5, 150.0, 150.0, 150.0, 0.05470459518599562, 0.04065448919584245, 0.02745914250547046], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 678.642857142857, 148, 2062, 539.0, 1565.5, 2062.0, 2062.0, 0.07819481680071491, 0.015097883154602323, 0.05321349279490617], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 150.0, 148, 153, 149.5, 153.0, 153.0, 153.0, 0.0514668039114771, 0.040510003860010295, 0.018294840452907874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1523.5909090909095, 1010, 2933, 1345.5, 2164.4, 2820.0499999999984, 2933.0, 0.09964219393994293, 0.051572619910322026, 0.04583151693917297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 294.25, 290, 302, 292.5, 302.0, 302.0, 302.0, 0.05459707359685521, 0.08461480058418869, 0.1227900981382398], "isController": false}, {"data": ["addBook", 55, 12, 21.818181818181817, 1465.9636363636366, 754, 4185, 1174.0, 2693.2, 3136.999999999997, 4185.0, 0.26696566821506756, 76.53180937650168, 0.9713672874225192], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 283.2075471698114, 143, 644, 151.0, 591.2, 603.4, 644.0, 0.2516726735710453, 0.18703408651129438, 0.12165817716569084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19726c82-436f-43bc-aed1-83d66a25e07a", 3, 0, 0.0, 532.6666666666667, 234, 1069, 295.0, 1069.0, 1069.0, 1069.0, 0.022199529369977357, 0.02226456705367846, 0.014236026321241988], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 960.4905660377358, 707, 1329, 888.0, 1186.0, 1298.3, 1329.0, 0.2515221837820394, 73.95587335442798, 0.12649797328881865], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 217.43396226415098, 139, 601, 150.0, 442.6, 447.9, 601.0, 0.25221641119840865, 0.4463048213784341, 0.12265993435235109], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1340.9999999999995, 993, 1978, 1294.0, 1717.4, 1764.4, 1978.0, 0.2512074546997123, 226.0369093144051, 0.1260943669098165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 177.1875, 148, 459, 154.0, 271.4000000000002, 459.0, 459.0, 0.11776048988363791, 0.08797536597752247, 0.041860174138324414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, 7.361963190184049, 238.3067484662577, 139, 2415, 154.0, 435.1999999999999, 533.5999999999997, 1966.3599999999897, 0.7074376434948287, 1.5299474928279713, 0.33899466546445667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 211.89999999999998, 145, 452, 155.5, 449.8, 452.0, 452.0, 0.0662651001596989, 0.05131662541664182, 0.023555172322392966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 155.5, 144, 185, 154.0, 179.60000000000002, 185.0, 185.0, 0.1446706933342978, 0.11740365836015769, 0.05142591052117617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19726c82-436f-43bc-aed1-83d66a25e07a", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6241fecd-9832-4f70-a34f-ef83c82b83d8", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cdc8f8b-775e-4c5f-89a7-2555b2e85677", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06636cd7-233c-450c-bd90-b24e82e358d6", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 357.1, 293, 590, 301.5, 588.7, 590.0, 590.0, 0.06687487042993855, 0.1036429876682739, 0.1504031509767075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 474.73333333333335, 290, 883, 582.0, 712.6000000000001, 883.0, 883.0, 0.08015432379140638, 0.12422354673531438, 0.18026895282383681], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73beb24a-be01-4bb6-a882-c15f34d92324", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bfb957-db19-43a8-afda-ed4dbca8bd63", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59250376-238a-415a-9b02-ec3686a6298a", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 177.40000000000003, 151, 449, 157.0, 284.6000000000001, 449.0, 449.0, 0.0750251334196956, 0.06220345534504059, 0.02666909039528242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe92c7ea-8adf-4d17-b665-f4db01816933", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 166.8421052631579, 144, 449, 152.0, 158.0, 449.0, 449.0, 0.10304302317383357, 0.07999922209296649, 0.03662857464382365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ef1d023-b5f9-4709-b8aa-a017d6a79d8f", 3, 0, 0.0, 345.6666666666667, 263, 434, 340.0, 434.0, 434.0, 434.0, 0.025898460768148345, 0.031066350237834196, 0.01660806240665763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9591c4e-5bc0-488d-9d44-b57fc94312d4", 3, 0, 0.0, 403.33333333333337, 233, 741, 236.0, 741.0, 741.0, 741.0, 0.02738300610641036, 0.022560673325300984, 0.017560065764853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 148.75, 143, 161, 148.5, 156.8, 161.0, 161.0, 0.12093086533592327, 0.08987147316468518, 0.060701625764320866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 181.3125, 139, 433, 147.5, 430.9, 433.0, 433.0, 0.12093360744951022, 0.032359187930825976, 0.06896994799854879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 201.37500000000003, 144, 444, 149.0, 433.5, 444.0, 444.0, 0.12093269339783078, 0.032595140017384075, 0.0710951967045841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 203.06250000000003, 143, 451, 148.5, 446.8, 451.0, 451.0, 0.12093817791517698, 0.03259661826620004, 0.07121652469028489], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.6369426751592356], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.3184713375796178], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.1592356687898089], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.5923566878980893], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1256, 34, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
