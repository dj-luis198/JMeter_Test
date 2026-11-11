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

    var data = {"OkPercent": 97.81790820165538, "KoPercent": 2.18209179834462};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8206205559146735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdbf2179-b44a-4b9c-8967-aad8d146e8db"], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed7d48c4-3c48-43ea-b95c-925eb607d133"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=262cef38-0455-48ae-9f99-6eb0b5df8d52"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93bf01d4-1090-4058-b0aa-e60945f9aada"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2bc7818-6c7a-4e21-9ca6-9f5fa4934634"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd69b56a-33e6-4c1b-803c-8f1c754f5dbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21aada8d-4eb8-4e27-9ad2-2e2f6b071c4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf0c472d-fe97-4492-b6b1-a39eedc37605"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54b37244-6b31-4d8f-9457-733ef7bd9367"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/837ee22c-0892-46aa-9c9c-f599a51c7cb3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dca33d09-e011-48c3-9abf-1c57c70cab59"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f960ce78-18ec-45b6-bac7-da65cc533f69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37facc9c-9690-41ac-bbb5-e2bdf4bec7ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2bc7818-6c7a-4e21-9ca6-9f5fa4934634"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdbf2179-b44a-4b9c-8967-aad8d146e8db"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21aada8d-4eb8-4e27-9ad2-2e2f6b071c4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e05b1aa-f490-4166-962b-821cfdd9ec31"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ed7d48c4-3c48-43ea-b95c-925eb607d133"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39f4934e-f748-44e9-9899-8c230d90e32c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd69b56a-33e6-4c1b-803c-8f1c754f5dbf"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.888268156424581, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39f4934e-f748-44e9-9899-8c230d90e32c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93bf01d4-1090-4058-b0aa-e60945f9aada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54b37244-6b31-4d8f-9457-733ef7bd9367"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37facc9c-9690-41ac-bbb5-e2bdf4bec7ea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf0c472d-fe97-4492-b6b1-a39eedc37605"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/262cef38-0455-48ae-9f99-6eb0b5df8d52"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f960ce78-18ec-45b6-bac7-da65cc533f69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=837ee22c-0892-46aa-9c9c-f599a51c7cb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 29, 2.18209179834462, 264.9352896914972, 78, 3296, 88.0, 646.0, 802.0, 1200.0, 5.1965012570919145, 714.3832001786908, 3.8037134003945274], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdbf2179-b44a-4b9c-8967-aad8d146e8db", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1219.9272727272728, 964, 2183, 1173.0, 1397.2, 1592.999999999999, 2183.0, 0.2517381374124066, 302.9251765957337, 1.2377944549526045], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed7d48c4-3c48-43ea-b95c-925eb607d133", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=262cef38-0455-48ae-9f99-6eb0b5df8d52", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.0265003551136365, 3.9173473011363638], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 624.2142857142856, 83, 2193, 497.5, 1517.5, 2193.0, 2193.0, 0.0693004123374534, 0.0130856735628827, 0.04686575736688133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 624.2142857142856, 83, 2193, 497.5, 1517.5, 2193.0, 2193.0, 0.07136339771331285, 0.013475217467211068, 0.0482608915199894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 81.42105263157896, 80, 84, 81.0, 82.0, 84.0, 84.0, 0.11014301200558832, 0.03817868384897654, 0.06232907905949462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 81.78947368421052, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.11014301200558832, 0.08185432825805929, 0.05528662907311757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93bf01d4-1090-4058-b0aa-e60945f9aada", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 119.36842105263158, 80, 633, 81.0, 242.0, 633.0, 633.0, 0.11014237351017947, 1.7326251311563792, 0.06436105285964384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 152.89473684210526, 80, 714, 82.0, 326.0, 714.0, 714.0, 0.11014301200558832, 5.244275869477633, 0.06425386442554623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2bc7818-6c7a-4e21-9ca6-9f5fa4934634", 3, 0, 0.0, 287.0, 179, 495, 187.0, 495.0, 495.0, 495.0, 0.07630481229016177, 0.034525940456811476, 0.048932447985552956], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 213.5, 81, 304, 203.0, 303.5, 304.0, 304.0, 0.06923632335341186, 0.13639111382698832, 0.04475537168778375], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd69b56a-33e6-4c1b-803c-8f1c754f5dbf", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 0.2633586916909621, 1.0050337099125364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21aada8d-4eb8-4e27-9ad2-2e2f6b071c4e", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 105.76923076923079, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.08354487323672119, 0.06208754739564924, 0.04193561019890107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 118.38461538461539, 80, 247, 81.0, 246.6, 247.0, 247.0, 0.08354648397835504, 0.04166027348620198, 0.04656812733769489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 467.0, 397, 634, 400.0, 634.0, 634.0, 634.0, 0.06495374365541111, 19.098557301960675, 0.037043931928476645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 724.0, 706, 793, 714.0, 793.0, 793.0, 793.0, 0.06476803789855475, 58.27839435118618, 0.0368747715770092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 195.7142857142857, 80, 245, 240.0, 245.0, 245.0, 245.0, 0.06504850760138275, 0.11510536696650932, 0.036018070126937515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 105.07142857142856, 80, 242, 82.0, 241.5, 242.0, 242.0, 0.10480453953376952, 0.07788696736835801, 0.05260696613316165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 104.85714285714285, 79, 243, 81.0, 242.0, 243.0, 243.0, 0.10467837569069036, 0.028009643495360507, 0.05969938613609684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 92.92857142857142, 79, 240, 81.0, 165.5, 240.0, 240.0, 0.10480610869890702, 0.02824852148525228, 0.06161452874681838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 104.92857142857143, 78, 240, 81.5, 240.0, 240.0, 240.0, 0.10468228925211981, 0.02821514827498542, 0.061643965252957275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.14285714285714, 80, 241, 82.0, 241.0, 241.0, 241.0, 0.06514476096525923, 0.04841324520953347, 0.03658031011232818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 389.94444444444446, 80, 814, 555.0, 760.9000000000001, 814.0, 814.0, 0.0912270031929451, 45.61438258641225, 0.049276044042369876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 190.6923076923077, 79, 717, 82.0, 650.5999999999999, 717.0, 717.0, 0.08354541014369811, 11.584331761233644, 0.04801099666461016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 371.05555555555554, 80, 657, 525.0, 639.0, 657.0, 657.0, 0.09122746554896127, 14.913097128108703, 0.04936538310467338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 166.99999999999997, 80, 556, 82.0, 492.79999999999995, 556.0, 556.0, 0.08354541014369811, 3.798303706845582, 0.048092583979203615], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 458.0, 84, 799, 453.0, 742.5, 799.0, 799.0, 0.07148437300545835, 0.01349806066725556, 0.04892112050478179], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 223.64285714285714, 162, 485, 166.0, 484.0, 485.0, 485.0, 0.10461345329009311, 0.1621304202845486, 0.2352781083272309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 457.3181818181818, 106, 1356, 420.0, 861.4999999999998, 1295.5499999999993, 1356.0, 0.09237758919686084, 0.056743655864087375, 0.04176838261537751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 100.55555555555556, 81, 243, 82.5, 241.2, 243.0, 243.0, 0.09122422915526363, 0.06779456873745666, 0.04579028690020069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 169.33333333333334, 80, 333, 161.0, 271.80000000000007, 333.0, 333.0, 0.0912270031929451, 0.10053184075819775, 0.047771432010541785], "isController": false}, {"data": ["login", 22, 0, 0.0, 2069.3636363636365, 1232, 4200, 1996.0, 3319.9999999999995, 4089.1499999999983, 4200.0, 0.09004141905276428, 34.39632968026088, 0.18336026901920338], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf0c472d-fe97-4492-b6b1-a39eedc37605", 3, 0, 0.0, 313.3333333333333, 187, 479, 274.0, 479.0, 479.0, 479.0, 0.04260758414997869, 0.02739257119017185, 0.027323222908677745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 84.38461538461539, 82, 94, 84.0, 90.0, 94.0, 94.0, 0.08055571047038339, 0.0652155116991678, 0.028635037706269094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 510.94444444444446, 162, 899, 640.0, 845.0000000000001, 899.0, 899.0, 0.0911867961519172, 60.6689817981023, 0.19211957691859552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54b37244-6b31-4d8f-9457-733ef7bd9367", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/837ee22c-0892-46aa-9c9c-f599a51c7cb3", 3, 0, 0.0, 298.3333333333333, 185, 496, 214.0, 496.0, 496.0, 496.0, 0.022595465843187466, 0.027104261599005797, 0.014489930895533628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 236.42105263157896, 163, 797, 165.0, 409.0, 797.0, 797.0, 0.11008940418455619, 7.093489895675805, 0.2461111551710152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 662.7777777777777, 81, 955, 793.0, 955.0, 955.0, 955.0, 0.07989347536617843, 74.34503994673769, 0.15188082556591212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dca33d09-e011-48c3-9abf-1c57c70cab59", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 702.521739130435, 106, 1458, 719.0, 1228.0000000000002, 1421.1999999999994, 1458.0, 0.0926250337275938, 0.02903970996282917, 0.04178981013881674], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 323.0, 163, 800, 171.0, 798.4, 800.0, 800.0, 0.08350087033599465, 15.478127037340945, 0.18450857128405068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 109.42105263157895, 83, 242, 83.0, 241.0, 242.0, 242.0, 0.1286225874802835, 0.09985835649104043, 0.04572131039338203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f960ce78-18ec-45b6-bac7-da65cc533f69", 3, 0, 0.0, 392.66666666666663, 216, 683, 279.0, 683.0, 683.0, 683.0, 0.01694178238845248, 0.023355614718455812, 0.010864359148844854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 208.44444444444446, 161, 326, 165.0, 324.2, 326.0, 326.0, 0.09620780886715305, 0.14910331315641787, 0.21637361701274754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 141.75, 81, 242, 83.0, 242.0, 242.0, 242.0, 0.04555912435362992, 0.0338579039385863, 0.022868544841568146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 121.125, 81, 241, 81.0, 241.0, 241.0, 241.0, 0.04556016219417741, 0.012190902774613877, 0.025983530001366804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 101.24999999999999, 80, 240, 82.0, 240.0, 240.0, 240.0, 0.04555990272960767, 0.012279817532589568, 0.026784239690648262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 142.25, 80, 241, 86.5, 241.0, 241.0, 241.0, 0.04555990272960767, 0.012279817532589568, 0.026828731783157644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 3.510974702380952, 7.359095982142857], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 773.4909090909089, 633, 1188, 645.0, 1048.8, 1064.6, 1188.0, 0.2519641752754427, 301.43675054974, 0.4975308226630323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 702.521739130435, 106, 1458, 719.0, 1228.0000000000002, 1421.1999999999994, 1458.0, 0.09088825486647331, 0.02849519675331347, 0.041006224363584635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37facc9c-9690-41ac-bbb5-e2bdf4bec7ea", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.25, 81, 237, 81.0, 237.0, 237.0, 237.0, 0.03851060245023708, 0.010379810816665462, 0.02267763015380172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 81.625, 80, 84, 81.5, 84.0, 84.0, 84.0, 0.038510787834442124, 0.010379860783501978, 0.022640131129232577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 135.26315789473685, 80, 784, 81.0, 243.0, 784.0, 784.0, 0.12821377960726096, 6.104685338501248, 0.07479576472771442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2bc7818-6c7a-4e21-9ca6-9f5fa4934634", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 141.0, 79, 394, 82.0, 266.0, 394.0, 394.0, 0.12821291441450558, 2.0168887828882993, 0.07492046792652725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.875, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.038510787834442124, 0.010304644401012834, 0.021963183686830274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 90.36842105263159, 80, 240, 82.0, 84.0, 240.0, 240.0, 0.12834975985084407, 0.09538492895165268, 0.06442556305013072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 103.0, 81, 240, 83.0, 240.0, 240.0, 240.0, 0.03850911944084759, 0.02861859364695802, 0.0193297728443317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 123.15789473684211, 80, 243, 81.0, 241.0, 243.0, 243.0, 0.12835236100790381, 0.0444905593460785, 0.07263360889684524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.125, 82, 242, 84.0, 242.0, 242.0, 242.0, 0.040800297842174246, 0.03211429693436762, 0.014503230873585377], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 673.4285714285716, 82, 2703, 490.0, 1849.0, 2703.0, 2703.0, 0.07266800583420276, 0.013579630833553931, 0.04945743114706447], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fdbf2179-b44a-4b9c-8967-aad8d146e8db", 3, 0, 0.0, 465.3333333333333, 182, 995, 219.0, 995.0, 995.0, 995.0, 0.04089756523161654, 0.03409461736919595, 0.02622662874553535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1121.3636363636365, 753, 3296, 965.5, 1561.0999999999997, 3051.1999999999966, 3296.0, 0.09251238404413682, 0.047882386272844246, 0.04255208289530121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21aada8d-4eb8-4e27-9ad2-2e2f6b071c4e", 3, 0, 0.0, 283.6666666666667, 174, 468, 209.0, 468.0, 468.0, 468.0, 0.03145775223874337, 0.02622503368600969, 0.02017310283539207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 205.625, 163, 479, 166.0, 479.0, 479.0, 479.0, 0.038493925177432935, 0.05965806568025984, 0.08657373992541803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e05b1aa-f490-4166-962b-821cfdd9ec31", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["addBook", 62, 18, 29.032258064516128, 758.4516129032256, 411, 2004, 664.0, 1257.4, 1415.5999999999995, 2004.0, 0.29781347269722935, 81.61301739837116, 1.0837299426228721], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ed7d48c4-3c48-43ea-b95c-925eb607d133", 3, 0, 0.0, 1032.0, 182, 2703, 211.0, 2703.0, 2703.0, 2703.0, 0.042107036085729924, 0.027070767014751498, 0.02700223342737238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39f4934e-f748-44e9-9899-8c230d90e32c", 3, 0, 0.0, 417.6666666666667, 188, 615, 450.0, 615.0, 615.0, 615.0, 0.03751969784136672, 0.030912225011881237, 0.024060483316241027], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 152.74545454545452, 80, 385, 83.0, 326.4, 342.7999999999999, 385.0, 0.2526273241713824, 0.18774354852970898, 0.12211965377425223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd69b56a-33e6-4c1b-803c-8f1c754f5dbf", 3, 0, 0.0, 326.6666666666667, 220, 456, 304.0, 456.0, 456.0, 456.0, 0.022296212616683513, 0.02635336849322195, 0.014298026970985197], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 474.40000000000003, 395, 656, 407.0, 625.4, 644.2, 656.0, 0.25238851311043603, 74.21060294181756, 0.12693367602722125], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 109.23636363636365, 80, 256, 83.0, 242.0, 244.79999999999995, 256.0, 0.252756191377797, 0.4472599792739923, 0.12292244463490518], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 617.4363636363637, 550, 821, 558.0, 722.8, 795.4, 821.0, 0.25239430414890346, 227.1048385350461, 0.12669010969974256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 94.05555555555557, 81, 243, 84.5, 112.5000000000002, 243.0, 243.0, 0.0958073633281349, 0.07157483686135077, 0.03405652368304795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, 10.05586592178771, 139.24581005586597, 81, 1513, 84.0, 234.0, 270.0, 1145.7999999999947, 0.7304661516676256, 1.5265760623385527, 0.35218562154915956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 125.87499999999999, 82, 285, 85.0, 285.0, 285.0, 285.0, 0.044922620785696636, 0.03478870926079827, 0.0159685878574156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 137.8421052631579, 83, 885, 85.0, 198.0, 885.0, 885.0, 0.11717617746640435, 0.0950912143306465, 0.041652469333760926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39f4934e-f748-44e9-9899-8c230d90e32c", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 284.875, 164, 483, 170.5, 483.0, 483.0, 483.0, 0.04553785903755735, 0.07057478739512062, 0.10241571226903767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 269.9473684210526, 162, 867, 168.0, 507.0, 867.0, 867.0, 0.12814027988534815, 8.256578254088685, 0.286464919490811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93bf01d4-1090-4058-b0aa-e60945f9aada", 3, 0, 0.0, 306.3333333333333, 195, 485, 239.0, 485.0, 485.0, 485.0, 0.03594493236361893, 0.0292169583697775, 0.023050623944117613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54b37244-6b31-4d8f-9457-733ef7bd9367", 3, 0, 0.0, 308.6666666666667, 220, 423, 283.0, 423.0, 423.0, 423.0, 0.023735867269030233, 0.02805499155398723, 0.0152212430078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37facc9c-9690-41ac-bbb5-e2bdf4bec7ea", 3, 0, 0.0, 332.66666666666663, 177, 644, 177.0, 644.0, 644.0, 644.0, 0.033080086890361564, 0.027577507332752597, 0.02121346717904046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf0c472d-fe97-4492-b6b1-a39eedc37605", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/262cef38-0455-48ae-9f99-6eb0b5df8d52", 3, 0, 0.0, 836.3333333333334, 303, 1802, 404.0, 1802.0, 1802.0, 1802.0, 0.06496600112607735, 0.029395423686604014, 0.041661140045043094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 139.7857142857143, 82, 861, 83.5, 476.5, 861.0, 861.0, 0.10369525446074764, 0.08597389749724096, 0.03686042248409389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f960ce78-18ec-45b6-bac7-da65cc533f69", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 84.44444444444444, 82, 88, 84.0, 87.1, 88.0, 88.0, 0.09110279938657448, 0.07072922413313155, 0.032384198219446395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=837ee22c-0892-46aa-9c9c-f599a51c7cb3", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 82.0, 80, 85, 82.0, 84.1, 85.0, 85.0, 0.09624947864865732, 0.07152915356604318, 0.048312726587314316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 81.0, 80, 83, 81.0, 82.1, 83.0, 83.0, 0.09625205204027613, 0.025754943612339515, 0.054893748429219985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 124.88888888888889, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.0962515373509438, 0.02594279717662157, 0.0565853764504572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 116.38888888888889, 80, 241, 81.0, 240.1, 241.0, 241.0, 0.0962515373509438, 0.02594279717662157, 0.05667937209240148], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.526711813393529], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.4482758620689653, 0.07524454477050414], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07524454477050414], "isController": false}, {"data": ["401/Unauthorized", 20, 68.96551724137932, 1.5048908954100828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 29, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
