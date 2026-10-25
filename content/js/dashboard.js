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

    var data = {"OkPercent": 97.05882352941177, "KoPercent": 2.9411764705882355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8005050505050505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72c7f200-c529-4b07-aad2-964bbabe09fb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f0b51655-7166-4758-b5d6-4b8bfc225231"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=644e74dc-e431-471b-8ed8-57bdf1cab8ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d678ce9d-b1bf-4bf5-bdbd-a3117ce2a3c2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0b51655-7166-4758-b5d6-4b8bfc225231"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa6abde2-dc29-4f56-a29b-7a1c3482cfed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a708374-7317-461e-b650-71641ef928bc"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5fae845-aa2b-4a3e-8298-4c1c3d7f1a47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5b6065e-6e2a-411b-9ea8-0fef8629fdca"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/367e6c77-bfea-4264-9c01-91b1740c4aab"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0125724f-4ab1-4f1a-97d9-a744f9dd0369"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28cbd91b-3568-43b4-9926-86d27eae4938"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/644e74dc-e431-471b-8ed8-57bdf1cab8ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f33743ca-ea0c-42d1-9275-b156507379ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a708374-7317-461e-b650-71641ef928bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=367e6c77-bfea-4264-9c01-91b1740c4aab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/620ad419-294a-4ae0-8af8-b933cd0af72f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e342b01-befd-4445-8128-1a9ebff90be8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8876404494382022, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d678ce9d-b1bf-4bf5-bdbd-a3117ce2a3c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa6abde2-dc29-4f56-a29b-7a1c3482cfed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5fae845-aa2b-4a3e-8298-4c1c3d7f1a47"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e342b01-befd-4445-8128-1a9ebff90be8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f33743ca-ea0c-42d1-9275-b156507379ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0125724f-4ab1-4f1a-97d9-a744f9dd0369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89ec65a2-a2b9-4c04-903d-cc3a57f950d9"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5b6065e-6e2a-411b-9ea8-0fef8629fdca"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 40, 2.9411764705882355, 295.367647058823, 77, 3152, 87.0, 800.0, 997.7500000000002, 1364.0, 5.338294807330735, 754.801337419484, 3.90969606433234], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1352.4827586206898, 967, 1704, 1358.0, 1608.5, 1695.0, 1704.0, 0.24742338406934677, 297.7329624137751, 1.21657884647379], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 461.79999999999995, 81, 916, 453.0, 841.6, 916.0, 916.0, 0.09869979470442702, 0.02083876524911828, 0.06582556620782229], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 461.79999999999995, 81, 916, 453.0, 841.6, 916.0, 916.0, 0.10179291249881242, 0.021491823908440667, 0.06788845023683818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 134.71428571428572, 79, 321, 81.5, 281.5, 321.0, 321.0, 0.07266913741733885, 0.019444671535498875, 0.041444117433326065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 82.42857142857143, 80, 87, 82.0, 87.0, 87.0, 87.0, 0.07272802834315162, 0.0540488570011117, 0.03650606110193353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 139.99999999999997, 79, 241, 82.5, 240.5, 241.0, 241.0, 0.07272878397473195, 0.019602680055689468, 0.04282759446949547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 117.07142857142858, 79, 241, 81.0, 240.0, 241.0, 241.0, 0.07272953962201419, 0.019602883726246013, 0.042757014504348184], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 172.66666666666666, 79, 295, 179.0, 283.0, 295.0, 295.0, 0.09916371930056524, 0.168558954897035, 0.06408197120946683], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/72c7f200-c529-4b07-aad2-964bbabe09fb", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0b51655-7166-4758-b5d6-4b8bfc225231", 3, 0, 0.0, 756.6666666666666, 179, 1674, 417.0, 1674.0, 1674.0, 1674.0, 0.03592728317884602, 0.02995109772819813, 0.02303930594476779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 97.42857142857144, 80, 243, 82.0, 211.0000000000001, 242.9, 243.0, 0.11356814900141149, 0.08439976698249428, 0.05700588729172413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 532.125, 395, 640, 504.5, 640.0, 640.0, 640.0, 0.036885737207565265, 10.845631460767407, 0.021036397001189564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 110.47619047619047, 79, 240, 81.0, 237.6, 239.8, 240.0, 0.11347854985220769, 0.030364377597172764, 0.0647182354625872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 870.1249999999999, 706, 1105, 873.0, 1105.0, 1105.0, 1105.0, 0.03687009742923246, 33.1757784775415, 0.0209914714855884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 161.125, 80, 242, 161.0, 242.0, 242.0, 242.0, 0.03695184251124722, 0.06538744006873043, 0.020460639359255052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=644e74dc-e431-471b-8ed8-57bdf1cab8ea", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 92.78571428571429, 78, 240, 82.0, 162.5, 240.0, 240.0, 0.08911578049510183, 0.06622764546559813, 0.044731944506330404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 103.42857142857143, 79, 240, 81.5, 240.0, 240.0, 240.0, 0.08911407875138445, 0.033405347322121935, 0.05028828802306781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 165.92857142857142, 79, 950, 81.5, 595.5, 950.0, 950.0, 0.08911351151792136, 5.749767121331228, 0.05184198423963896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 141.42857142857144, 77, 461, 81.0, 350.0, 461.0, 461.0, 0.08911294429167939, 1.8938862751744066, 0.051928678614166404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 102.5, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.036977804073105115, 0.027480575097297847, 0.02076390365433149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 491.1764705882354, 80, 1026, 240.0, 1023.6, 1026.0, 1026.0, 0.09301663903525331, 39.39987767628021, 0.05092190774390878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 111.00000000000001, 79, 242, 81.0, 241.4, 242.0, 242.0, 0.1134736443952125, 0.03058469321589712, 0.06671009172452921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 332.29411764705884, 79, 639, 239.0, 639.0, 639.0, 639.0, 0.09301867486690123, 12.884133784109128, 0.05101386080849644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 119.0, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.11356999156337205, 0.030610661788565127, 0.06687764151632164], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 373.86666666666673, 81, 784, 414.0, 724.6, 784.0, 784.0, 0.10195897170978398, 0.021526884456694626, 0.06835764913198929], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d678ce9d-b1bf-4bf5-bdbd-a3117ce2a3c2", 3, 0, 0.0, 323.3333333333333, 275, 419, 276.0, 419.0, 419.0, 419.0, 0.04164410944071961, 0.034093403399547466, 0.026705369660878137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 282.42857142857144, 161, 1030, 166.0, 756.0, 1030.0, 1030.0, 0.08906815622554602, 7.73935551037644, 0.19868859068728809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 498.0434782608696, 84, 998, 409.0, 940.0, 987.5999999999999, 998.0, 0.10018032458425165, 0.06153654703466239, 0.04529637722901222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 109.4705882352941, 78, 239, 82.0, 239.0, 239.0, 239.0, 0.09301714798481084, 0.06912700157855571, 0.04669024810956326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 145.47058823529412, 78, 241, 82.0, 240.2, 241.0, 241.0, 0.09301714798481084, 0.09063401103621103, 0.0493726130158348], "isController": false}, {"data": ["login", 23, 0, 0.0, 2344.434782608696, 1422, 4367, 2164.0, 3931.0000000000014, 4350.599999999999, 4367.0, 0.10251701559595815, 42.79685814597977, 0.2138049120693728], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0b51655-7166-4758-b5d6-4b8bfc225231", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 82.76190476190477, 80, 86, 83.0, 85.0, 85.9, 86.0, 0.11171104077452988, 0.0904379421895364, 0.03970978402532117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa6abde2-dc29-4f56-a29b-7a1c3482cfed", 3, 0, 0.0, 322.6666666666667, 199, 567, 202.0, 567.0, 567.0, 567.0, 0.027541633769715218, 0.02762232214989993, 0.017661789884875972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a708374-7317-461e-b650-71641ef928bc", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 620.4117647058822, 164, 1112, 480.0, 1104.0, 1112.0, 1112.0, 0.09297441562845236, 52.419683734877985, 0.19790711001334457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5fae845-aa2b-4a3e-8298-4c1c3d7f1a47", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5b6065e-6e2a-411b-9ea8-0fef8629fdca", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 530.7500000000001, 79, 1189, 465.0, 1142.8, 1189.0, 1189.0, 0.07371097925035934, 44.101840355839755, 0.10752517114767995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 286.28571428571433, 164, 404, 321.5, 364.5, 404.0, 404.0, 0.07263746640517178, 0.11257388592285901, 0.16336336438585022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/367e6c77-bfea-4264-9c01-91b1740c4aab", 3, 0, 0.0, 384.0, 204, 653, 295.0, 653.0, 653.0, 653.0, 0.021540737124024382, 0.025460422036892104, 0.013813558637476575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0125724f-4ab1-4f1a-97d9-a744f9dd0369", 3, 0, 0.0, 355.0, 173, 512, 380.0, 512.0, 512.0, 512.0, 0.08509431286342363, 0.03999875904127074, 0.05456894412140122], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 688.2173913043478, 83, 1442, 632.0, 1340.2000000000003, 1432.1999999999998, 1442.0, 0.10033897122016551, 0.03130480470982406, 0.04527012178097311], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28cbd91b-3568-43b4-9926-86d27eae4938", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/644e74dc-e431-471b-8ed8-57bdf1cab8ea", 3, 0, 0.0, 884.3333333333334, 176, 2294, 183.0, 2294.0, 2294.0, 2294.0, 0.02551931812381973, 0.02559408175113561, 0.016364927312475543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f33743ca-ea0c-42d1-9275-b156507379ec", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 240.1904761904762, 162, 486, 166.0, 449.60000000000014, 485.5, 486.0, 0.11342216269058975, 0.1757821994042636, 0.2550891022230744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 83.37499999999999, 81, 89, 83.0, 86.2, 89.0, 89.0, 0.08854111904906838, 0.0687404195742279, 0.03147360091197353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 322.7368421052632, 162, 1224, 165.0, 1000.0, 1224.0, 1224.0, 0.09250828922960071, 11.777970330096355, 0.20556182505465292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 113.5, 81, 241, 82.0, 240.8, 241.0, 241.0, 0.04614972817810103, 0.034296819476108284, 0.023165000276898367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 113.5, 79, 242, 81.5, 241.4, 242.0, 242.0, 0.04611588922963407, 0.019265993566833454, 0.025913166662823676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 192.5, 80, 1038, 81.0, 958.0000000000002, 1038.0, 1038.0, 0.04594722501734507, 4.145485175415018, 0.026617083867469825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a708374-7317-461e-b650-71641ef928bc", 3, 0, 0.0, 342.6666666666667, 179, 446, 403.0, 446.0, 446.0, 446.0, 0.07944915254237288, 0.03594867253707627, 0.05094883805614407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=367e6c77-bfea-4264-9c01-91b1740c4aab", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 135.8, 80, 470, 81.5, 446.80000000000007, 470.0, 470.0, 0.04606745196316446, 1.3657110021743837, 0.026731718707531566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 83.0, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.09099595068019473, 0.026836696392010556, 0.05625042654351881], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 924.1034482758619, 633, 1364, 872.5, 1277.6000000000001, 1364.0, 1364.0, 0.2584877574850033, 309.241222836502, 0.5104123492526138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 688.2173913043478, 83, 1442, 632.0, 1340.2000000000003, 1432.1999999999998, 1442.0, 0.10252295622715521, 0.031986187260408305, 0.04625547439154854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.85714285714286, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.04683715390688774, 0.012624076638965835, 0.02758086309165362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.14285714285715, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.046836840520558025, 0.012623992171556655, 0.027534939446656182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/620ad419-294a-4ae0-8af8-b933cd0af72f", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 199.875, 80, 872, 81.5, 758.6000000000001, 872.0, 872.0, 0.09172418537457865, 10.33833012179252, 0.05293847026989841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 179.5, 79, 633, 82.0, 521.0000000000001, 633.0, 633.0, 0.09172418537457865, 3.392876721261666, 0.053028044669678275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 111.125, 78, 241, 82.0, 240.3, 241.0, 241.0, 0.09172365954470668, 0.06816572745461112, 0.04604097754490159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 114.14285714285714, 80, 313, 81.0, 313.0, 313.0, 313.0, 0.04676393565282454, 0.012513006219603443, 0.026670057052001497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 141.625, 77, 256, 82.5, 248.3, 256.0, 256.0, 0.09172365954470668, 0.041763824475312, 0.05134823030664366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.71428571428571, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.046836213760479604, 0.03480699089035642, 0.02350958386024074], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 552.2666666666668, 79, 2294, 508.0, 1395.2000000000005, 2294.0, 2294.0, 0.10309916077283131, 0.021015851066388983, 0.0701490448721914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 129.42857142857142, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.04865266859887265, 0.038294971572940775, 0.01729450329100551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1187.5217391304348, 799, 3152, 1023.0, 1952.6000000000001, 2918.5999999999967, 3152.0, 0.10202406880858067, 0.052805426238816164, 0.046927086336759266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e342b01-befd-4445-8128-1a9ebff90be8", 3, 0, 0.0, 307.0, 190, 508, 223.0, 508.0, 508.0, 508.0, 0.03053901358986105, 0.025001829159668143, 0.019583937751310634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 197.71428571428572, 162, 395, 165.0, 395.0, 395.0, 395.0, 0.04673802004393374, 0.07243480254855747, 0.10511490250115177], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 926.5666666666667, 406, 3544, 698.5, 1673.6999999999998, 2122.7999999999984, 3544.0, 0.27732199394513646, 78.52567701953964, 1.0084653621940791], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 140.72413793103445, 79, 398, 82.0, 325.3, 328.05, 398.0, 0.25912985980181036, 0.1925759993253688, 0.1252629693377892], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 516.7586206896551, 392, 1021, 478.0, 658.8000000000001, 717.65, 1021.0, 0.2589216360276064, 76.13155799956252, 0.13021937749435283], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.1206896551724, 78, 367, 83.0, 243.1, 261.5499999999998, 367.0, 0.25946487606078633, 0.45913120646693834, 0.1261850666779996], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 780.3793103448277, 552, 1225, 786.5, 966.9000000000001, 1035.2, 1225.0, 0.25891470099816083, 232.97190308164295, 0.12996304327446745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 96.3157894736842, 82, 242, 84.0, 151.0, 242.0, 242.0, 0.09040214681308642, 0.06753676007032336, 0.03213513812496432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, 8.98876404494382, 167.06179775280899, 80, 2401, 84.0, 254.2, 491.04999999999995, 1935.6900000000046, 0.7623028397922083, 1.6768261877256396, 0.36443505945319765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 115.10000000000001, 80, 248, 83.0, 247.0, 248.0, 248.0, 0.046640485807300174, 0.03611904809100491, 0.016579235189313733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d678ce9d-b1bf-4bf5-bdbd-a3117ce2a3c2", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 83.42857142857143, 82, 87, 83.0, 86.0, 87.0, 87.0, 0.07023564057412619, 0.05699786847372936, 0.02496657536033392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa6abde2-dc29-4f56-a29b-7a1c3482cfed", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5fae845-aa2b-4a3e-8298-4c1c3d7f1a47", 3, 0, 0.0, 399.66666666666663, 194, 704, 301.0, 704.0, 704.0, 704.0, 0.019335627827835572, 0.02665572390979285, 0.012399474876574243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 323.40000000000003, 163, 1277, 165.0, 1197.3000000000002, 1277.0, 1277.0, 0.045929709173081514, 5.558853862860778, 0.10212183773952344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e342b01-befd-4445-8128-1a9ebff90be8", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 352.24999999999994, 159, 1113, 317.5, 998.9000000000001, 1113.0, 1113.0, 0.09168003667201467, 13.834475006446251, 0.20325840161586065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 84.78571428571429, 82, 94, 84.0, 91.5, 94.0, 94.0, 0.08653994745788905, 0.07175040565600371, 0.030762246947921495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 85.29411764705883, 83, 96, 84.0, 91.19999999999999, 96.0, 96.0, 0.08840859331527025, 0.06863753094300766, 0.03142649215503747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f33743ca-ea0c-42d1-9275-b156507379ec", 3, 0, 0.0, 1181.6666666666667, 180, 2569, 796.0, 2569.0, 2569.0, 2569.0, 0.02293770882872413, 0.027111595298534283, 0.014709403122586763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 90.36842105263159, 81, 242, 82.0, 86.0, 242.0, 242.0, 0.09254523757336645, 0.06877629472005066, 0.046453371203818705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0125724f-4ab1-4f1a-97d9-a744f9dd0369", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 131.15789473684214, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.09254749147588893, 0.039395473088163664, 0.051962828787140765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89ec65a2-a2b9-4c04-903d-cc3a57f950d9", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 214.31578947368422, 79, 1143, 81.0, 918.0, 1143.0, 1143.0, 0.09254839306763826, 8.788130166270495, 0.053571135008621616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5b6065e-6e2a-411b-9ea8-0fef8629fdca", 3, 0, 0.0, 319.0, 178, 583, 196.0, 583.0, 583.0, 583.0, 0.03140407624909713, 0.02618028622198495, 0.020138681709219192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 156.1578947368421, 79, 628, 82.0, 475.0, 628.0, 628.0, 0.09254794226956779, 2.8867575463105033, 0.053661252916477914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.0, 0.5882352941176471], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.29411764705882354], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.0, 0.29411764705882354], "isController": false}, {"data": ["401/Unauthorized", 24, 60.0, 1.7647058823529411], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 40, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
